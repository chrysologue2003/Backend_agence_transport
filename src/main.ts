import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend clients
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global response interceptor (format ITDCMADA)
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global exception filter (format ITDCMADA)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Mendrika Transport API')
    .setDescription(
      'API de gestion pour une agence de location de véhicules et de transport de marchandises',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentification')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('roles', 'Gestion des rôles')
    .addTag('types-prestations', 'Types de prestations')
    .addTag('categories-depenses', 'Catégories de dépenses')
    .addTag('clients', 'Gestion des clients')
    .addTag('vehicules', 'Gestion des véhicules')
    .addTag('chauffeurs', 'Gestion des chauffeurs')
    .addTag('activites', 'Gestion des activités / prestations')
    .addTag('paiements', 'Gestion des paiements')
    .addTag('depenses', 'Gestion des dépenses')
    .addTag('recettes', 'Consultation des recettes')
    .addTag('caisse', 'Mouvements de caisse et solde')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
  console.log(`Application démarrée sur http://localhost:${port}`);
  console.log(`Documentation Swagger : http://localhost:${port}/api/docs`);
}

await bootstrap();
