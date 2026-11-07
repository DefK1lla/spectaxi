import { Global, Module } from "@nestjs/common";
import { OBJECT_STORAGE } from "./object-storage.port";
import { S3ObjectStorageAdapter } from "./providers/s3-object-storage-adapter/s3-object-storage.adapter";

@Global()
@Module({
  providers: [
    {
      provide: OBJECT_STORAGE,
      useClass: S3ObjectStorageAdapter,
    },
  ],
  exports: [OBJECT_STORAGE],
})
export class StorageModule {}
