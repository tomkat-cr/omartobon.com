#!/bin/bash
# ftp_transfer_site.sh
# 2025-06-28 | CR

# The script reads the following parameters from .env:
# - remote host
# - remote username
# - remote password
# - remote directory path

set -euo pipefail
IFS=$'\n\t'

echo ""
echo "Reading .env file..."
set -o allexport; . .env ; set +o allexport ;

PROCESS_MODE="${PROCESS_MODE:-$1}"
if [ "${PROCESS_MODE}" = "" ]; then
    echo "Usage: $0 {local|cicd}"
    exit 1
elif [ "${PROCESS_MODE}" != "local" ] && [ "${PROCESS_MODE}" != "cicd" ]; then
    echo "Usage: $0 {local|cicd}"
    exit 1
else
    echo ""
    echo "Process mode: ${PROCESS_MODE}"
fi

# Restore the .htaccess file
echo ""
echo "Restoring production .htaccess file..."
echo ""
cd ./local_apache
bash ./local_test_run.sh restore-htaccess
cd -

FAKE_PASSWORD=$(echo ${REMOTE_PASSWORD} | perl -i -pe's/./*/g')

echo ""
echo "FTP TRANSFER"
echo ""
echo "Source directory path: ${SOURCE_DIRECTORY_PATH}"
echo ""
echo "Remote host: ${REMOTE_HOST}"
echo "Remote username: ${REMOTE_USERNAME}"
echo "Remote password: ${FAKE_PASSWORD}"
echo "Remote directory path: ${REMOTE_DIRECTORY_PATH}"
echo ""

if [ "${SOURCE_DIRECTORY_PATH}" = "" ]; then
    echo "ERROR: SOURCE_DIRECTORY_PATH is not defined"
    exit 1
fi
if [ "${REMOTE_HOST}" = "" ]; then
    echo "ERROR: REMOTE_HOST is not defined"
    exit 1
fi
if [ "${REMOTE_USERNAME}" = "" ]; then
    echo "ERROR: REMOTE_USERNAME is not defined"
    exit 1
fi
if [ "${REMOTE_PASSWORD}" = "" ]; then
    echo "ERROR: REMOTE_PASSWORD is not defined"
    exit 1
fi
if [ "${REMOTE_DIRECTORY_PATH}" = "" ]; then
    echo "ERROR: REMOTE_DIRECTORY_PATH is not defined"
    exit 1
fi

if [ "${PROCESS_MODE}" = "local" ]; then
    echo ""
    echo "Press any key to continue... Ctrl-C to cancel"
    read answer
fi

# Automate the ftp transfer of all files/directories under the `./site` directory to a remote host, replacing all existing ones

echo ""
echo "Verifying tools..."
echo ""

if ! lftp --help > /dev/null 2>&1
then
    if ! brew install lftp
    then
        if ! sudo apt install lftp
        then
            if ! sudo yum install lftp
            then
                echo "ERROR: could not install lftp"
                exit 1
            fi
        fi
    fi
fi

echo ""
echo "Begin FTP transfer..."
echo ""

# Transfer the entire local directory to the FTP server
lftp -u ${REMOTE_USERNAME},${REMOTE_PASSWORD} -e "set ssl:verify-certificate no" ${REMOTE_HOST} <<EOF
mirror -R ${SOURCE_DIRECTORY_PATH} ${REMOTE_DIRECTORY_PATH}
bye
EOF
if [ $? -ne 0 ]; then
    echo "ERROR: FTP transfer failed"
    exit 1
fi

echo ""
echo "FTP transfer complete"






