---
title: "AWS MFA Authentication Script Setup and Implementation"
description: "Learn how to implement and configure a Bash script for streamlined AWS Multi-Factor Authentication (MFA) session management with automatic credential handling."
date: "2024-01-25"
tags: ["AWS", "Security", "MFA", "Bash", "DevOps", "Authentication"]
slug: "aws-mfa-authentication-script-setup"
readTime: 15
---

# AWS MFA Authentication Script Setup and Implementation

Managing AWS Multi-Factor Authentication (MFA) sessions can be cumbersome when working with multiple profiles and frequent credential rotations. This guide demonstrates how to implement a Bash script that automates MFA authentication, generates temporary session credentials, and seamlessly updates your AWS configuration.

## Overview

The AWS MFA Authentication Script provides a streamlined solution for:
- Authenticating AWS profiles with MFA
- Generating temporary session credentials via AWS STS
- Automatically updating AWS credentials file
- Managing session lifecycles with proper cleanup

## Prerequisites

Before implementing the script, ensure you have:

- **AWS CLI installed** and configured
- **Existing AWS credentials file** at `~/.aws/credentials`
- **AWS profile configured** with access key and secret key
- **MFA device** associated with your AWS account
- **MFA ARN** for each profile you want to use

### Initial AWS Configuration

Your `~/.aws/credentials` file should contain profiles like this:

```ini
[my-profile]
aws_access_key_id = AKIA...
aws_secret_access_key = SECRET...
mfa_arn = arn:aws:iam::123456789012:mfa/username

[production]
aws_access_key_id = AKIA...
aws_secret_access_key = SECRET...
mfa_arn = arn:aws:iam::987654321098:mfa/prod-user
```

## Script Implementation

### Core Script Structure

```bash
#!/bin/bash

# AWS MFA Authentication Script
# Generates temporary credentials using MFA token

set -e  # Exit on any error

# Configuration
CREDENTIALS_FILE="$HOME/.aws/credentials"
TEMP_FILE="/tmp/aws_temp_credentials"

# Cleanup function
cleanup() {
    [[ -f "$TEMP_FILE" ]] && rm -f "$TEMP_FILE"
}

# Set trap for cleanup
trap cleanup EXIT

# Validate prerequisites
validate_setup() {
    if [[ ! -f "$CREDENTIALS_FILE" ]]; then
        echo "❌ AWS credentials file not found at $CREDENTIALS_FILE"
        exit 1
    fi
    
    echo "✅ AWS credentials file found"
}

# Get user inputs
get_inputs() {
    read -p "Enter AWS Profile Name: " PROFILE_NAME
    read -p "Enter 6-digit MFA Code: " MFA_CODE
    
    # Validate MFA code format
    if [[ ! "$MFA_CODE" =~ ^[0-9]{6}$ ]]; then
        echo "❌ Invalid MFA code format. Please enter 6 digits."
        exit 1
    fi
}

# Extract MFA ARN from credentials file
get_mfa_arn() {
    MFA_ARN=$(aws configure get mfa_arn --profile "$PROFILE_NAME" 2>/dev/null)
    
    if [[ -z "$MFA_ARN" ]]; then
        echo "❌ MFA ARN not found for profile '$PROFILE_NAME'"
        echo "Please add 'mfa_arn = your-mfa-arn' to your profile"
        exit 1
    fi
    
    echo "✅ Found MFA ARN: $MFA_ARN"
}

# Generate session token using AWS STS
generate_session_token() {
    echo "🔐 Generating session token..."
    
    # Call AWS STS to get session token
    SESSION_OUTPUT=$(aws sts get-session-token \
        --profile "$PROFILE_NAME" \
        --serial-number "$MFA_ARN" \
        --token-code "$MFA_CODE" \
        --duration-seconds 43200 \
        --output json 2>/dev/null)
    
    if [[ $? -ne 0 ]]; then
        echo "❌ Failed to generate session token"
        echo "Please check your MFA code and try again"
        exit 1
    fi
    
    echo "✅ Session token generated successfully"
}

# Extract credentials from session output
extract_credentials() {
    ACCESS_KEY=$(echo "$SESSION_OUTPUT" | jq -r '.Credentials.AccessKeyId')
    SECRET_KEY=$(echo "$SESSION_OUTPUT" | jq -r '.Credentials.SecretAccessKey')
    SESSION_TOKEN=$(echo "$SESSION_OUTPUT" | jq -r '.Credentials.SessionToken')
    EXPIRATION=$(echo "$SESSION_OUTPUT" | jq -r '.Credentials.Expiration')
    
    echo "✅ Credentials extracted"
    echo "🕒 Session expires at: $EXPIRATION"
}

# Update AWS credentials file with temporary credentials
update_credentials() {
    echo "📝 Updating AWS credentials file..."
    
    # Create temporary credentials content
    cat > "$TEMP_FILE" << EOF
[default]
aws_access_key_id = $ACCESS_KEY
aws_secret_access_key = $SECRET_KEY
aws_session_token = $SESSION_TOKEN
region = us-east-1

EOF
    
    # Backup existing credentials and update
    cp "$CREDENTIALS_FILE" "${CREDENTIALS_FILE}.backup"
    
    # Remove existing [default] section and append new one
    grep -v "^\[default\]" "$CREDENTIALS_FILE" | \
    grep -v "^aws_access_key_id.*=.*ASIA" | \
    grep -v "^aws_secret_access_key.*=.*" | \
    grep -v "^aws_session_token.*=.*" > "${CREDENTIALS_FILE}.tmp"
    
    cat "$TEMP_FILE" "${CREDENTIALS_FILE}.tmp" > "$CREDENTIALS_FILE"
    rm -f "${CREDENTIALS_FILE}.tmp"
    
    echo "✅ AWS credentials updated successfully"
}

# Main execution function
main() {
    echo "🚀 AWS MFA Authentication Script"
    echo "=================================="
    
    validate_setup
    get_inputs
    get_mfa_arn
    generate_session_token
    extract_credentials
    update_credentials
    
    echo ""
    echo "✅ MFA authentication completed!"
    echo "🔄 Starting new shell session with updated credentials..."
    
    # Start new shell session
    exec bash
}

# Execute main function
main "$@"
```

## Installation and Setup

### 1. Create the Script File

```bash
# Create script directory
mkdir -p ~/scripts

# Create the MFA script
touch ~/scripts/aws-mfa-auth.sh
chmod +x ~/scripts/aws-mfa-auth.sh
```

### 2. Add Script to PATH

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Add scripts directory to PATH
export PATH="$HOME/scripts:$PATH"

# Create alias for easy access
alias aws-mfa='~/scripts/aws-mfa-auth.sh'
```

### 3. Install Required Dependencies

```bash
# Ensure jq is installed for JSON parsing
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

## Usage

### Basic Usage

```bash
# Run the script
aws-mfa

# Or directly
~/scripts/aws-mfa-auth.sh
```

### Interactive Flow

1. **Enter AWS Profile Name**: Input the profile name from your credentials file
2. **Enter MFA Code**: Provide the 6-digit code from your MFA device
3. **Automatic Processing**: Script validates, generates token, and updates credentials
4. **New Shell Session**: Automatically starts with updated credentials

### Example Session

```bash
$ aws-mfa
🚀 AWS MFA Authentication Script
==================================
✅ AWS credentials file found
Enter AWS Profile Name: my-profile
Enter 6-digit MFA Code: 123456
✅ Found MFA ARN: arn:aws:iam::123456789012:mfa/username
🔐 Generating session token...
✅ Session token generated successfully
✅ Credentials extracted
🕒 Session expires at: 2024-01-25T18:30:00Z
📝 Updating AWS credentials file...
✅ AWS credentials updated successfully

✅ MFA authentication completed!
🔄 Starting new shell session with updated credentials...
```

## Advanced Features

### 1. Session Duration Customization

Modify the `--duration-seconds` parameter to adjust session length:

```bash
# 12 hours (43200 seconds) - maximum for MFA sessions
--duration-seconds 43200

# 8 hours
--duration-seconds 28800

# 4 hours
--duration-seconds 14400
```

### 2. Multiple Profile Management

Create profile-specific scripts or use parameters:

```bash
# Profile-specific script
#!/bin/bash
PROFILE_NAME="production"
# ... rest of script
```

### 3. Credential Validation

Add validation to ensure credentials work:

```bash
validate_credentials() {
    echo "🔍 Validating new credentials..."
    
    if aws sts get-caller-identity >/dev/null 2>&1; then
        echo "✅ Credentials validated successfully"
        CALLER_INFO=$(aws sts get-caller-identity --output json)
        echo "👤 Authenticated as: $(echo "$CALLER_INFO" | jq -r '.Arn')"
    else
        echo "❌ Credential validation failed"
        exit 1
    fi
}
```

## Security Best Practices

### 1. Script Permissions

```bash
# Set restrictive permissions
chmod 700 ~/scripts/aws-mfa-auth.sh

# Ensure credentials file is secure
chmod 600 ~/.aws/credentials
```

### 2. Temporary File Security

```bash
# Create temporary files securely
TEMP_FILE=$(mktemp /tmp/aws_temp.XXXXXX)
chmod 600 "$TEMP_FILE"
```

### 3. Session Management

- **Regular Rotation**: Don't rely on maximum session duration
- **Principle of Least Privilege**: Use role-based access when possible
- **Monitor Sessions**: Track active sessions through CloudTrail

## Troubleshooting

### Common Issues

#### 1. MFA ARN Not Found

```bash
# Add MFA ARN to your profile
aws configure set mfa_arn "arn:aws:iam::ACCOUNT:mfa/USERNAME" --profile PROFILE_NAME
```

#### 2. Invalid MFA Code

- Ensure device time synchronization
- Wait for next code if near expiration
- Verify 6-digit format

#### 3. Permission Errors

```bash
# Check file permissions
ls -la ~/.aws/credentials

# Fix permissions if needed
chmod 600 ~/.aws/credentials
```

#### 4. Session Token Errors

- Verify original profile credentials are valid
- Check MFA device is properly associated
- Ensure account has STS permissions

### Debug Mode

Add debug output to the script:

```bash
# Enable debug mode
set -x  # Show all commands
set -v  # Show script lines

# Add verbose output
echo "DEBUG: Profile=$PROFILE_NAME"
echo "DEBUG: MFA ARN=$MFA_ARN"
```

## Integration with Development Workflows

### 1. IDE Integration

Configure your IDE to use the default profile after MFA authentication:

```json
// VS Code settings.json
{
    "aws.profile": "default"
}
```

### 2. CI/CD Considerations

For automated deployments, consider using:
- IAM roles for EC2/Lambda
- AWS SSO for team access
- Service-specific credentials

### 3. Team Collaboration

Create team-wide setup scripts:

```bash
#!/bin/bash
# setup-aws-mfa.sh - Team setup script

echo "Setting up AWS MFA authentication..."

# Copy script template
cp templates/aws-mfa-auth.sh ~/scripts/
chmod +x ~/scripts/aws-mfa-auth.sh

# Update shell configuration
echo 'alias aws-mfa="~/scripts/aws-mfa-auth.sh"' >> ~/.bashrc

echo "Setup completed! Run 'aws-mfa' to authenticate."
```

## Conclusion

This AWS MFA Authentication Script streamlines the process of managing MFA sessions while maintaining security best practices. By automating credential rotation and session management, developers can focus on their work without compromising security.

The script provides robust error handling, automatic cleanup, and seamless integration with existing AWS workflows. With proper setup and security considerations, it becomes an essential tool for any AWS development environment requiring MFA authentication.

For additional security and advanced use cases, consider integrating with AWS SSO, implementing role-based access patterns, and establishing team-wide authentication policies.