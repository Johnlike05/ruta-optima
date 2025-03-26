export interface Response<T> {
    isError: boolean;
    data: T;
    timestamp: Date;
}