# anasnajaa-api
API used for https://anasnajaa.github.io and other projects.  
This documentation is a work in progress.  

## Getting started
Before you run this API, you need to perfom the following in order:

### 1- Setup enviroment variables
Create a .env file and populate it with the following configurations:  
#### Environment Config
| Key | Description |
| --- | --- |
| NODE_ENV | environments: production/development |
| PORT | ports: 80/5000 |

#### Databases Config
| Key | Description |
| --- | --- |
| ATLAS_URI_RW | MongoDB connection URL |
| DATABASE_URL | Postgres connection URL |

#### AWS S3 Config
| Key | Description |
| --- | --- |
| AWS_S3_ACCESS_KEY_ID | AWS S3 bucket access key |
| AWS_S3_ACCESS_KEY_SECRET | AWS S3 bucket secret |
| AWS_S3_REGION | AWS S3 bucket region |
| AWS_S3_BUCKET | AWS S3 bucket bucket name |

#### JWT Config
| Key | Description |
| --- | --- |
| JWT_SECRET | JWT secret |
| JWT_REFRESH_SECRET | JWT refresh secret |
| ISSUER | JWT issuer |

#### SMS Config
| Key | Description |
| --- | --- |
| TWILIO_ACC_SID | Twilio account ID |
| TWILIO_AUTH | Twilio account auth |
| TWILIO_FROM | Twilio number |

#### Captcha Validation Config
| Key | Description |
| --- | --- |
| GOOGLE_RECAPTCHA_SECRET_KEY | Recaptcha v2 secret key |

#### Email Config
| Key | Description |
| --- | --- |
| EMAIL_CLIENT | clients: smtp/sendgrid |
| EMAIL_USER | SMTP email id |
| EMAIL_PASS | SMTP email password |
| EMAIL_HOST | SMTP email host |
| EMAIL_PORT | SMTP email port |
| SENDGRID_API_KEY | Sendgrid API key |

### 2- Install required packages
Install required packages before starting up:  
`npm install`

### 3- Seed the database
To seed the database with required data, run the following command:  
`npm run seed`
You can specify whcih collections to seed in the following directories:  
For MongoDB: `\seeds\mongo\index.js`  
For Postgres: `\seeds\postgres\index.js`  

### 4- Run the project
To startup the project, run the following command:
`npm start`

## Sending a request
### HTTP methods used
GET, POST, PATCH, DELETE are the only methods used to interact with the API.  

### POST request body
Requests body is raw of type JSON:  
`curl --request POST 'http://localhost:5000/api/v1/request/service/add-info' \  
--header 'Content-Type: application/json' \  
--data-raw '{  
    "name": "",  
    "email": ""  
}'`  

### Authentication
This section is pending.  

## Reading the response

### HTTP status codes used
| Code | Message | Details |  
| ---- | ---- | --- |
| 200 | OK | Everything worked as expected. |
| 400 | Bad Request	| The request was unacceptable, often due to missing a required  parameter. |
| 401 | Unauthorized | JWT is not valid or not included. |
| 403 | Forbidden | User doe not have the necessary permissions to access the resource or perform the action.  |
| 402 | Request Failed | The parameters were valid but the request failed. |
| 404 | Not Found | The requested resource could not be found. |
| 422 | Unprocessable Entity | User input was not valid. |
| 429 | Too Many Requests | Too many requests hit the API too quickly. |
| 500 | Server Error | Something went wrong on my end.  |

### Response format
All endpoints return a JSON object that is formated as follows:  
`{
    messages: [],  
    errors: {},  
    data: {}  
}`  
Below is the decsription of each key.

### Messages
Array of message objects. Each message object is formated as follows:
`{    
    type: "",  
    code: "",  
    message: "",  
}`    
- Type: used to give context to the message. Available contexts:
    - success 
    - error 
    - warning 
    - info
- Code: programatic code to be used by the client to take certain actions.  
- Message: the actual message to be displayed to the client.  

### Errors
A JSON object that contains user input validation errors.  
Usually returns with status code 422.  
Each error object is composed of the following:  
`{  
    field_name: {  
        code: "",  
        message: ""  
    }  
}`  
- Field_name: field name used as a key of the object.  
- Code: programatic code to be used by the client to take certain actions.  
- Message: the actual message to be displayed to the client.  

### Data
Can contain any valid JSON data.  
Used by the client to perform certain actions.  
Most of the processing is perfomed here.  

## i18n
To localize the messages and the data returned, attach a query string parameter with a parameter name of lang and the the desired language code.  

### Supported languages
en: English  
ar: Arabic  