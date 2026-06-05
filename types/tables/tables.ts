
export interface Table {
  id: string;
  number: string;
  capacity?: number;
  location?: string;
  active: boolean;
}


export interface TableRequest {
  establishmentId: string;
  number: string;
  capacity?: number;
  location?: string;
  active?: boolean;
}


export interface Waiter {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  active: boolean;
}

export interface WaiterRequest {
  establishmentId: string;
  name: string;
  phone?: string;
  email?: string;
  active?: boolean;
}


export interface AssignSaleRequest {
  tableId?: string;
  waiterId?: string;
}