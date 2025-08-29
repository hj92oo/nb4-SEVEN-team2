import swaggerAutogen from 'swagger-autogen';

const swagger = swaggerAutogen({ 
  openapi: '3.0.0',
  autoBody: false,
  autoExample: false
});

const outputFile = 'swagger/swagger-output.json';
const endpointsFiles = ['../app.js'];

const doc = {
  info: {
    title: 'SEVEN API By Team2',
    description: 'SEVEN API 명세서 Swagger 문서화',
  },
  servers: [
    { url: 'https://nb4-seven-team2-backend.onrender.com'}
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};

console.log(endpointsFiles)

swagger(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON 생성 완료!');
});
