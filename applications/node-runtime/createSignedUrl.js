const fs = require("fs");
const AWS = require('aws-sdk');
const crypto = require('crypto');

const region = process.env.AWS_DEFAULT_REGION || "us-east-1";
const ssm = new AWS.SSM({region: region});
const secretsManager = new AWS.SecretsManager({region: region});
const dynamoDB = new AWS.DynamoDB.DocumentClient({region: region});

const uuid = fs.readFileSync('uuid.txt');
const get = require("lodash/get")
const forEach = require("lodash/forEach")

const cfDomainParamName = "singleusesignedurl-domain-" + uuid,
    activeKeysTableParamName = "singleusesignedurl-activekeys-" + uuid,
    keyPairIdParamName = "singleusesignedurl-keyPairId-" + uuid,
    secretNameParamName = "singleusesignedurl-secretName-" + uuid,
    apiEndpointParams = "singleusesignedurl-api-endpoint-" + uuid;


const getSystemsManagerValues = async () => {

    const paramQuery = {
        "Names": [cfDomainParamName, activeKeysTableParamName, keyPairIdParamName, secretNameParamName, apiEndpointParams],
        "WithDecryption": true
    }

    return new Promise((resolve, reject) => {
        const parameterValues = {
            dynamoDBTableName: '',
            domain: '',
            cloudFrontURL: '',
            secretName: '',
            keyPairId: '',
            apiEndpoint: ''
        }


        ssm.getParameters(paramQuery, function (err, data) {
            if (err) {
                console.log(`err: ${err}`)
                return reject(err);
            }

            forEach(get(data, `Parameters`, []), (ssmParameter) => {
                const ssmParameterName = get(ssmParameter, 'Name')
                const ssmParameterValue = get(ssmParameter, 'Value')

                if (ssmParameterName === activeKeysTableParamName) {
                    parameterValues['dynamoDBTableName'] = ssmParameterValue
                    return
                }
                if (ssmParameterName === cfDomainParamName) {
                    parameterValues['domain'] = ssmParameterValue
                    parameterValues['cloudFrontURL'] = "https://" + ssmParameterValue + "/";
                    return
                }
                if (ssmParameterName === secretNameParamName) {
                    parameterValues['secretName'] = ssmParameterValue
                    return
                }
                if (ssmParameterName === keyPairIdParamName) {
                    parameterValues['keyPairId'] = ssmParameterValue
                    return
                }
                if (ssmParameterName === apiEndpointParams) {
                    parameterValues['apiEndpoint'] = ssmParameterValue
                }

            })

            resolve(parameterValues);
        })
    });
}

const getSecurePEM = async (secretName) => {
    return new Promise((resolve, reject) => {
        secretsManager.getSecretValue({SecretId: secretName}, function (err, data) {
            if (err) {
                return reject(err);
            }

            const securePEM = get(data, "SecretString")
            return resolve(securePEM);
        })
    });
}

const getSignedURL = async (filePath, epoch, securePEM, requestUUID, cloudfrontURL, keyPairId) => {
    const cloudfrontSigner = new AWS.CloudFront.Signer(keyPairId, securePEM)

    return new Promise((resolve, reject) => {
        return cloudfrontSigner.getSignedUrl({
            "url": cloudfrontURL + filePath + "?id=" + requestUUID,
            expires: epoch
        }, function (err, data) {
            if (err) return reject(err);
            
            return resolve(data);
            
        });
    })


}

const writeRecordToDynamoDB = async (signedURL, requestUUID, filePath, epoch, dynamoDBTableName) => {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: dynamoDBTableName,
            Item: {
                id: requestUUID,
                file: filePath,
                validuntil: epoch
            }
        };
        return dynamoDB.put(params, (err, data) => {
            if (err) reject(err)
            resolve(signedURL)
        })
            
    })
}


module.exports = async (filePath, expiresInSeconds) => {
    const parameterValues = await getSystemsManagerValues()
    const securePEM = await getSecurePEM(parameterValues["secretName"])
    
    const epoch = Math.floor((Date.now() / 1000)  + parseInt(expiresInSeconds))
    const requestUUID = "2f041b81-5cf6-4242-b138-22ad8ee63b7d" //crypto.randomUUID()
    
    const signedURL = await getSignedURL(
        filePath,
        epoch,
        securePEM,
        requestUUID,
        parameterValues["cloudFrontURL"],
        parameterValues["keyPairId"]
    )
    const dynamoDBRecord = await writeRecordToDynamoDB(
        signedURL, 
        requestUUID, 
        filePath, 
        epoch,
        parameterValues["dynamoDBTableName"]
    ) 
    
    return signedURL
}
