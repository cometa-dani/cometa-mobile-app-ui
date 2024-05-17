import { AxiosError } from 'axios';
import { ErrorMessage } from './errorMessages';


export type TypedAxiosError = AxiosError<{ message: ErrorMessage, status: number }>
