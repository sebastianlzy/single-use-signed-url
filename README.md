# Single Use SignedURL
AWS CDK to create a CloudFront distribution with a request Lambda to allow single use signed URL file downloads. Each file is tracked by an identifier which is stored in a DynamoDB database. 
Each request will check the identifier against values stored in the database. 
If the identifier is found the file process continues and the files is received, the id is then removed from the database.
If the identifier is not found the system will perform a 302 redirect to a specified URL.

### Architecture
<img alt="Architecture" src="./images/singleusesignedurl.jpg" />

### Constraints
* CloudFront Triggers for Lambda Functions must execute in US East (N. Virginia) Region <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html#lambda-requirements-cloudfront-triggers">see requirements doc</a>

### Step 1: Setting up Cloud9 environment

1. Navigate to https://us-east-1.console.aws.amazon.com/cloud9control/home?region=us-east-1#/create/
2. For Name, type a name to identify the Cloud9 environment
3. Click **Create**.
4. On the cloud9 console
   1. Identify the Cloud9 environment that you have created
   2. Click **Open**
5. In terminal,

```shell
# Download code repository
git clone https://github.com/sebastianlzy/single-use-signed-url
cd single-use-signed-url

# Installing mvn
sudo wget https://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo -O /etc/yum.repos.d/epel-apache-maven.repo
sudo sed -i s/\$releasever/6/g /etc/yum.repos.d/epel-apache-maven.repo
sudo yum install -y apache-maven

```


### Step 2: Create cloudfront key group
#### Creating key pair

In terminal,

```shell
openssl genrsa -out private_key.pem 2048
openssl rsa -pubout -in private_key.pem -out public_key.pem

```
#### Upload public key to cloudfront
Navigate to https://us-east-1.console.aws.amazon.com/cloudfront/v4/home?region=us-east-1#/publickey

1. Click **Create public key**
2. For **Key name**, type a name to identify the public key
3. In Cloud9, Open the **public_key.pem** file
4. Copy the contents of the file, then paste it into the **Key value** field
5. Record the **public key ID**

#### Add the public key to a key group

Navigate to https://us-east-1.console.aws.amazon.com/cloudfront/v4/home?region=us-east-1#/keygrouplist

1. Click **Create key group**
2. For **Key group name**, type a name to identify the key group
3. For **Public keys**, select the public key to add to the key group
4. Click **Create key group**
5. Record the **key group ID**

### Step 3: Upload private key to Secret Manager

Navigate to https://us-east-1.console.aws.amazon.com/secretsmanager/home?region=us-east-1#

1. Click **Store a new secret**
2. Select **Other type of secrets**
3. Select **Plaintext**
4. In Cloud9, open the **private_key.pem** file
5. Copy the contents of the file, then paste it into the **Key value** field.
6. Click **Next**
6. Enter a secret name, **SignedURLPemCFKeyGroup**
7. Click **Next**
8. Click **Next**
8. Click **Store**

### Step 4: Update cdk.json
In Cloud9, edit the **cdk.json** file and update the following values:

1. stackId - Update the stackID with a unique timestamp
2. keyPairId - The ID of the CloudFront Key Pair
3. CFKeyGroupId - The ID of the CloudFront Key Group
4. SecretName - The name of the secret created

### Step 5: Provision infrastructure

In terminal,

```
cdk bootstrap
cdk synth
cdk deploy
```

### Step 6: Generate single sign URL
Once the deployment is completed, the terminal window will display outputs of the deployment. 
1. Click the link for the output ```CreateSignedURLEndpoint```
2. Click the **Generate Single SignedURL** button on this page to generate a signed url with the given sample helloworld.html sample file.</br><img  alt="Generate Web Page" src="./images/Generate.jpg" width="226" height="74">
3. Click the **Open URL** button to display the file</br><img alt="Hello World Web Page" src="./images/HelloWorldPage.jpg" width="406" height="74">

### Step 7: Ensuring single use URL
Once the file is accessed, 
1. you can try refreshing the page
2. You should notice **Invalid File** is now displayed.</br><img alt="Invalid Web Page" src="./images/InvalidFile.jpg" width="292" height="72">

### Resource Cleanup
In a terminal, 
1. ```cdk destroy```

> [!NOTE] 
> The ```cdk destroy``` command will sometimes fail due to the ```CloudFrontViewRequest``` function currently being use by CloudFront. There can be a long wait period while the CloudFront resources are cleaned up.
> Alternatively, You can go to the CloudFormation console and manually delete the stack.
> It is recommended to check the option to retain the ```CloudFrontViewRequest``` function and remove it later
