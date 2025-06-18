const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ROOTS EDTECH API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],

        servers: [{ url: 'http://192.168.1.35:3000' }],
        // 👇 This controls the group (tag) order in Swagger UI
        tags: [
            {
                name: 'Auth',
                description: 'Authentication and login',
            },
            {
                name: 'Users',
                description: 'User management',
            },
            {
                name: 'Teachers',
                description: 'Teacher-related operations',
            },
        ],

    },
    apis: ['./routes/*.js'], // adjust to your route files
};

const specs = swaggerJsdoc(options);
module.exports = { swaggerUi, specs };
