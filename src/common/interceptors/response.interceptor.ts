import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  status: 'success';
  message: string;
  data: T;
  signature: 'ITDCMADA';
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success' as const,
        message: data?.message ?? 'Opération réussie',
        data: data?.data !== undefined ? data.data : data,
        signature: 'ITDCMADA' as const,
      })),
    );
  }
}
