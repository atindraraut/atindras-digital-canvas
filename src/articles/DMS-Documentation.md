---
title: "AWS DMS Migration: RDS Single Instance to Aurora Serverless v2 - PostgreSQL"
description: "A comprehensive guide for migrating PostgreSQL databases from AWS RDS Single Instance to Aurora Serverless v2 using AWS Database Migration Service (DMS) with minimal downtime."
date: "2024-01-20"
tags: ["AWS", "PostgreSQL", "Database Migration", "DMS", "Aurora Serverless"]
slug: "aws-dms-migration-rds-to-aurora-serverless"
readTime: 25
---

# AWS DMS Migration: RDS Single Instance to Aurora Serverless v2 - PostgreSQL

This comprehensive guide walks through migrating PostgreSQL databases from AWS RDS Single Instance to Aurora Serverless v2 using AWS Database Migration Service (DMS). The migration supports full load, change data capture (CDC), and full load + CDC tasks with minimal downtime.

## POC Status
✅ **PostgreSQL 17.4** - POC completed successfully

## Prerequisites

- PostgreSQL version 9.4 or higher (pglogical support varies by version)
- AWS DMS version 3.4.7 or later
- Source and target databases must be accessible from DMS replication instance
- Required permissions for DMS service role
- Understanding of logical replication concepts

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RDS Single    │───▶│   AWS DMS      │───▶│  Aurora         │
│   Instance      │    │   (Serverless) │    │  Serverless v2  │
│   (Source)      │    │                │    │  (Target)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Step 1: Configure Source Database (RDS Single Instance)

### 1.1 Create Custom Parameter Group (via AWS Console)

1. Navigate to **RDS Console** → **Parameter groups**
2. Click **Create parameter group**
3. Select **DB parameter group** type
4. Choose **postgres17** family
5. Enter group name: `postgres-dms-source-pg`
6. Enter description: `Parameter group for DMS source configuration`
7. Click **Create**

### 1.2 Configure Required Parameters

Set the following parameters in your custom parameter group:

| Parameter                    | Value         | Description                                                 |
| ---------------------------- | ------------- | ----------------------------------------------------------- |
| `rds.logical_replication`  | `1`         | Enables logical replication and sets wal_level to 'logical' |
| `shared_preload_libraries` | `pglogical` | Loads pglogical extension for DMS                           |
| ` x_replication_slots`    | `10`        | Maximum number of replication slots                         |
| `max_wal_senders`          | `10`        | Maximum number of WAL sender processes                      |
| `wal_sender_timeout`       | `0`         | Disables timeout for replication connections                |

**Important**: These are static parameters requiring a database restart.

**Configure via AWS Console:**
1. Navigate to **RDS Console** → **Parameter groups**
2. Select `postgres-dms-source-pg` parameter group
3. Click **Edit parameters**
4. Set the following parameters:
   - `rds.logical_replication` = `1`
   - `shared_preload_libraries` = `pglogical`
   - `max_replication_slots` = `10`
   - `max_wal_senders` = `10`
   - `wal_sender_timeout` = `0`
5. Click **Save changes**

### 1.3 Apply Parameter Group and Restart (via AWS Console)

**⚠️ DOWNTIME WARNING**: The following steps will cause database downtime during the reboot.

1. Navigate to **RDS Console** → **Databases**
2. Select your source database instance
3. Click **Modify**
4. In **Database options** section, change **DB parameter group** to `postgres-dms-source-pg`
5. Check **Apply immediately** 
6. Click **Continue** → **Modify DB instance**
7. **Reboot the instance** (Actions → Reboot) - **This will cause downtime**
8. Wait for instance status to become **Available**

**Important**: Plan this reboot during a maintenance window as it will temporarily make the database unavailable.

### 1.4 Create pglogical Extension

Connect to your source database and create the pglogical extension:

```sql
-- Connect to your source database
\c movies

-- Create pglogical extension
CREATE EXTENSION IF NOT EXISTS pglogical;

-- Grant necessary permissions to postgres user
GRANT USAGE ON SCHEMA pglogical TO postgres;
GRANT SELECT ON ALL TABLES IN SCHEMA pglogical TO postgres;
```

### 1.5 Validation Queries

Run these queries to ensure proper configuration:

```sql
-- Check WAL level (should show 'logical')
SHOW wal_level;

-- Check logical replication setting (should show 'on')
SHOW rds.logical_replication;

-- Check shared libraries (should include 'pglogical')
SHOW shared_preload_libraries;

-- Check max replication slots
SHOW max_replication_slots;

-- Verify pglogical extension
SELECT * FROM pg_catalog.pg_extension WHERE extname = 'pglogical';

-- Check user roles and permissions
SELECT
    r.rolname as username,
    ARRAY(SELECT b.rolname
          FROM pg_catalog.pg_auth_members m
          JOIN pg_catalog.pg_roles b ON (m.roleid = b.oid)
          WHERE m.member = r.oid) as memberof
FROM pg_catalog.pg_roles r
WHERE r.rolname = 'postgres';
```

## Step 2: Configure Database User Privileges

### 2.1 Execute Privilege Grant Script

Use the provided script to grant necessary privileges to the postgres user:

```sql
-- =================================================================
-- AWS DMS Privileges Setup Script for 'postgres' User
-- Database: movies
-- =================================================================

-- Connect to the movies database as master user first
-- Grant CONNECT privilege on database
GRANT CONNECT ON DATABASE movies TO postgres;

-- Grant USAGE and CREATE on schema
GRANT USAGE, CREATE ON SCHEMA public TO postgres;

-- For SOURCE database: Grant SELECT privileges on all DMS tables
GRANT SELECT ON public.actors TO postgres;
GRANT SELECT ON public.directors TO postgres;
GRANT SELECT ON public.movies TO postgres;
GRANT SELECT ON public.movies_actors TO postgres;
GRANT SELECT ON public.movies_revenues TO postgres;

-- Grant privileges on all sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Grant RDS replication role (essential for DMS logical replication)
GRANT rds_replication TO postgres;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO postgres;

-- Grant pglogical schema access
GRANT USAGE ON SCHEMA pglogical TO postgres;
GRANT SELECT ON ALL TABLES IN SCHEMA pglogical TO postgres;
```

### 2.2 Verify Privileges

```sql
-- Check privileges after granting
SELECT 
    table_name,
    privilege_type
FROM information_schema.table_privileges 
WHERE grantee = 'postgres'
AND table_schema = 'public'
AND table_name IN ('actors', 'directors', 'movies', 'movies_actors', 'movies_revenues')
ORDER BY table_name, privilege_type;

-- Check role memberships
SELECT r.rolname 
FROM pg_roles r
JOIN pg_auth_members m ON r.oid = m.roleid
JOIN pg_roles u ON u.oid = m.member
WHERE u.rolname = 'postgres';
```

## Step 3: Create Aurora Serverless v2 Target Database

### 3.1 Create Aurora Serverless v2 Cluster (via AWS Console)

1. Navigate to **RDS Console** → **Databases**
2. Click **Create database**
3. Choose **Standard create**
4. Select **Amazon Aurora** → **Aurora (PostgreSQL Compatible)**
5. Choose **Aurora PostgreSQL** version **17.4** (to match source)
6. Select **Serverless v2**
7. Configure:
   - **DB cluster identifier**: `movies-serverless-v2`
   - **Master username**: `postgres`
   - **Master password**: Set secure password
   - **Initial database name**: `movies`
8. **Serverless v2 scaling**: Min capacity 0.5, Max capacity 16
9. Select appropriate **VPC**, **Subnet group**, and **Security groups**
10. Click **Create database**

### 3.2 Aurora Serverless v2 Instance

Aurora Serverless v2 automatically creates the writer instance as part of the cluster creation process. No additional instance creation is needed.

### 3.3 Configure Target Parameter Group (Optional)

For the target database, you may also want to configure pglogical:

```sql
-- Connect to target database
-- Create pglogical extension if needed for bidirectional replication
CREATE EXTENSION IF NOT EXISTS pglogical;
```

## Step 4: Create DMS Replication Instance (Serverless)

### 4.1 Create DMS Replication Instance (via AWS Console)

1. Navigate to **DMS Console** → **Replication instances**
2. Click **Create replication instance**
3. Configure:
   - **Name**: `movies-migration-serverless`
   - **Instance class**: `dms.c5.large`
   - **Engine version**: Latest available
   - **Allocated storage**: 100 GB
   - **VPC**: Select appropriate VPC
   - **Multi AZ**: No
   - **Publicly accessible**: No
   - **VPC security groups**: Select appropriate security groups
   - **Subnet group**: Select DMS subnet group
4. Click **Create replication instance**
5. Wait for status to become **Available**

## Step 5: Create DMS Endpoints

### 5.1 Create Source Endpoint (via AWS Console)

1. Navigate to **DMS Console** → **Endpoints**
2. Click **Create endpoint**
3. Configure **Source endpoint**:
   - **Endpoint identifier**: `movies-source-endpoint`
   - **Source engine**: PostgreSQL
   - **Server name**: Your RDS endpoint
   - **Port**: 5432
   - **Database name**: `movies`
   - **Username**: `postgres`
   - **Password**: Your database password
4. **Endpoint-specific settings** → **Extra connection attributes**: `PluginName=pglogical`
5. Click **Create endpoint**

### 5.2 Create Target Endpoint (via AWS Console)

1. Navigate to **DMS Console** → **Endpoints**
2. Click **Create endpoint**
3. Configure **Target endpoint**:
   - **Endpoint identifier**: `movies-target-endpoint`
   - **Target engine**: Aurora PostgreSQL
   - **Server name**: Your Aurora Serverless v2 cluster endpoint
   - **Port**: 5432
   - **Database name**: `movies`
   - **Username**: `postgres`
   - **Password**: Your Aurora database password
4. Click **Create endpoint**

### 5.3 Test Endpoint Connections (via AWS Console)

1. Navigate to **DMS Console** → **Endpoints**
2. Select **Source endpoint** (`movies-source-endpoint`)
3. Click **Actions** → **Test connection**
4. Select your replication instance (`movies-migration-serverless`)
5. Click **Run test** - Wait for **Success** status
6. Repeat for **Target endpoint** (`movies-target-endpoint`)

## Step 6: Configure Table Mapping and Selection Rules

### 6.1 Create Table Mapping JSON

Create a `table-mapping.json` file with selection rules that exclude pglogical schema:

```json
{
  "rules": [
    {
      "rule-type": "selection",
      "rule-id": "2",
      "rule-name": "exclude-pglogical-schema",
      "object-locator": {
        "schema-name": "pglogical",
        "table-name": "%"
      },
      "rule-action": "exclude"
    },
    {
      "rule-type": "selection",
      "rule-id": "1",
      "rule-name": "include-public-schema",
      "object-locator": {
        "schema-name": "public",
        "table-name": "%"
      },
      "rule-action": "include"
    }
  ]
}
```

## Step 7: Create and Start DMS Task

### 7.1 Create Migration Task (via AWS Console)

1. Navigate to **DMS Console** → **Database migration tasks**
2. Click **Create task**
3. Configure **Task configuration**:
   - **Task identifier**: `movies-migration-task`
   - **Replication instance**: `movies-migration-serverless`
   - **Source database endpoint**: `movies-source-endpoint`
   - **Target database endpoint**: `movies-target-endpoint`
   - **Migration type**: **Migrate existing data and replicate ongoing changes**
4. **Task settings**:
   - **Target table preparation mode**: Drop tables on target
   - **Include LOB columns**: Limited LOB mode (32 KB)
   - **Enable validation**: Optional
   - **Enable CloudWatch logs**: Yes
5. **Table mappings**:
   - **Guided UI**: Select **public** schema
   - **Include**: All tables in public schema
   - **Add new selection rule** to exclude pglogical, information_schema, and pg_catalog schemas
6. Click **Create task**

### 7.2 Start the Migration Task (via AWS Console)

1. Navigate to **DMS Console** → **Database migration tasks**
2. Select your task (`movies-migration-task`)
3. Click **Actions** → **Start/Resume**
4. Monitor the task progress in the console
5. **Minimal downtime occurs during final switchover** once full load completes and CDC is active

## Step 8: Monitoring and Validation

### 8.1 Monitor Task Progress (via AWS Console)

1. Navigate to **DMS Console** → **Database migration tasks**
2. Select your task (`movies-migration-task`)
3. Monitor:
   - **Task progress**: Full Load and CDC status
   - **Table statistics**: Row counts and progress per table
   - **CloudWatch metrics**: Latency, throughput, errors
   - **Logs**: View detailed migration logs

### 8.2 Validation Queries

**On Source Database:**

```sql
-- Check replication slots
SELECT slot_name, plugin, slot_type, active, restart_lsn, confirmed_flush_lsn 
FROM pg_replication_slots;

-- Monitor WAL generation
SELECT pg_current_wal_lsn(), pg_current_wal_insert_lsn();
```

**On Target Database:**

```sql
-- Verify data migration
SELECT COUNT(*) FROM actors;
SELECT COUNT(*) FROM directors;
SELECT COUNT(*) FROM movies;
SELECT COUNT(*) FROM movies_actors;
SELECT COUNT(*) FROM movies_revenues;

-- Check for any errors in target
SELECT schemaname, tablename FROM pg_stat_user_tables;
```

## Step 9: Post-Migration Tasks

### 9.1 Clean Up Replication Slots (After Migration)

```sql
-- On source database, check for inactive slots
SELECT slot_name FROM pg_replication_slots WHERE active='f';

-- Drop inactive slots
SELECT pg_drop_replication_slot('slot_name_here');
```

### 9.2 Disable Logical Replication (Optional)

Once migration is complete, you may want to disable logical replication to reduce WAL generation:

1. Navigate to **RDS Console** → **Parameter groups**
2. Select `postgres-dms-source-pg` parameter group
3. Click **Edit parameters**
4. Set `rds.logical_replication` = `0`
5. Click **Save changes**
6. **Reboot the source database** - **This will cause downtime**

### 9.3 Update Application Connection Strings

Update your application to point to the new Aurora Serverless v2 endpoint:

```
Old: your-rds-endpoint.region.rds.amazonaws.com:5432
New: movies-serverless-v2.cluster-xxxxxx.region.rds.amazonaws.com:5432
```

## Troubleshooting

### Non-Blocking Errors (Can be Ignored)

During DMS migration, you may encounter minor errors that are non-blocking and can be safely ignored:

- **Permission warnings** on system catalogs or extensions
- **Sequence ownership** messages that don't affect data integrity
- **Index creation warnings** on target (indexes are recreated automatically)
- **Minor constraint validation** messages during full load phase
- **Replication slot lag warnings** during initial CDC setup

These errors typically don't impact the migration process and data integrity remains intact.

### Common Issues and Solutions

1. **WAL Level Not Set to Logical**

   ```sql
   -- Verify the parameter is set on the writer instance
   SHOW wal_level;
   -- If still 'replica', ensure you're connected to the writer instance and reboot again
   ```
2. **pglogical Extension Issues**

   ```sql
   -- Check if extension exists
   SELECT * FROM pg_extension WHERE extname = 'pglogical';

   -- Recreate if necessary
   DROP EXTENSION IF EXISTS pglogical CASCADE;
   CREATE EXTENSION pglogical;
   ```
3. **Replication Slot Issues**

   ```sql
   -- Check for stuck replication slots
   SELECT slot_name, active, restart_lsn, confirmed_flush_lsn 
   FROM pg_replication_slots 
   WHERE NOT active;

   -- Drop problematic slots
   SELECT pg_drop_replication_slot('problematic_slot_name');
   ```
4. **Task Failures**

   - Check CloudWatch logs for detailed error messages
   - Verify endpoint connectivity
   - Ensure all required permissions are granted
   - Check table mapping rules for syntax errors
   - **Note**: Some minor errors in logs are non-blocking and can be ignored if data validation passes

## Best Practices

1. **Performance Optimization**

   - Use appropriate replication instance size
   - Configure parallel load for large tables
   - Monitor CloudWatch metrics during migration
2. **Security**

   - Use SSL connections for endpoints
   - Implement least privilege access
   - Store credentials in AWS Secrets Manager
3. **Monitoring**

   - Set up CloudWatch alarms for task failures
   - Monitor source database storage for WAL accumulation
   - Track replication lag during CDC phase
4. **Testing**

   - Perform test migrations in non-production environment
   - Validate data integrity post-migration
   - Test application functionality with new endpoint

## Cost Optimization

- **Aurora Serverless v2**: Configure appropriate min/max capacity based on workload
- **DMS Instance**: Use smallest instance that meets performance requirements
- **Storage**: Monitor and optimize storage usage during migration

## Downtime Summary

**⚠️ Planned Downtime Phases:**

1. **Initial Setup**: Parameter group changes require database reboot (planned downtime)
2. **CDC Setup**: Once parameters are applied, CDC setup occurs with no downtime
3. **Migration Phase**: Full load and continuous replication with no downtime
4. **Final Switchover**: Minimal downtime during application cutover to new endpoint

**Key Point**: After initial parameter group setup and reboot, the migration process enables minimal downtime switchover once CDC is active.

## Conclusion

This migration approach provides a robust method for moving from RDS Single Instance to Aurora Serverless v2. The use of pglogical ensures reliable change data capture, while Aurora Serverless v2 provides automatic scaling and cost optimization benefits. PostgreSQL 17.4 compatibility has been verified through POC testing.

For additional support, refer to the [AWS DMS User Guide](https://docs.aws.amazon.com/dms/latest/userguide/) and [Aurora PostgreSQL documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/).
