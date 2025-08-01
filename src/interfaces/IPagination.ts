export interface IPagination<T> {
    data: Array<T>;
    page: number;
    pageSize: number;
    total: number;
}

export interface IPaginationQuery {
    page?: number;
    pageSize?: number;
    order?: IOrderQuery;
}

export interface IOrderQuery {
    flow?: 'asc' | 'desc';
    column?: string;
}


class OrderQuery implements IOrderQuery {
    flow?: 'asc' | 'desc';
    column?: string;
}

export class PaginationQuery implements IPaginationQuery {
    page?: number = 1;
    pageSize?: number = 10;
    order?: OrderQuery = undefined;
}