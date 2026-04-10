import { Global, Module } from '@nestjs/common';
import { InMemoryStoreService } from './store/in-memory-store.service';

@Global()
@Module({
  providers: [InMemoryStoreService],
  exports: [InMemoryStoreService],
})
export class CommonModule {}
