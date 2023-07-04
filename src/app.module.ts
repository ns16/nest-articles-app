import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { ArticlesTagsModule } from './articles-tags/articles-tags.module';
import { ContentsModule } from './contents/contents.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AdminsModule,
    ArticlesModule,
    ArticlesTagsModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [config]
    }),
    ContentsModule,
    TagsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database')
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
