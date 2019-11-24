import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
      .setTitle('DNA mutations API')
      .setContactEmail('samuelzv@gmail.com')
      .setDescription('Services to detect DNA mutations')
      .setVersion('1.0')
      .setSchemes('http', 'https')
      .addTag('mutations')
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
