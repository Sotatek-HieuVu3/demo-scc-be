import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

import { deepPick } from '../helpers/object.helper';

@Injectable()
export class MultiLanguageService implements OnModuleInit {
  languages: any;

  async onModuleInit(): Promise<void> {
    await this.readLanguageFiles();
  }

  private async readLanguageFiles(): Promise<any> {
    return new Promise((resolve) => {
      const languages = {};
      const files = fs.readdirSync(path.join(process.cwd(), 'dist/i18n/'));
      files.forEach((file) => {
        const lang = file.split('.')[0];
        languages[lang] = require(path.join(process.cwd(), 'dist/i18n/', file));
      });
      this.languages = languages;
      resolve(true);
    });
  }

  private getLanguage(lang: string, fallback = 'en'): any {
    return lang in this.languages
      ? this.languages[lang]
      : this.languages[fallback];
  }

  public translate(lang: string, key: string, fallback = 'en'): string {
    try {
      const language = this.getLanguage(lang, fallback);
      return deepPick(language, key) || key;
    } catch (error: any) {
      console.error(`${this.translate.name} error: ${error}`);
      return key;
    }
  }
}
