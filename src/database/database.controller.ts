import { Controller } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller()
export class DatabaseController {
  constructor(readonly databaseService: DatabaseService) {}
}
