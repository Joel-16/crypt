export type Role = 'OWNER' | 'HR' | 'HEAD-WAREHOUSE' | 'WAREHOUSE' | 'CRM' | 'OPERATIONS';

export interface CreateEmployee {
  email?: string;
  firstName?: string;
  userName?: string;
  lastName?: string;
  role?: Role;
  department?: string;
  division?: string;
  jobTitle?: string;
  warehouse?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UpdateEmployee extends CreateEmployee {
  position?: Position;
  biography?: Biography;
  emergency?: {
    firstName_emergency?: string;
    lastName_emergency?: string;
    address_emergency?: string;
    relationship_emergency?: string;
    phoneNumber_emergency?: string;
    email_emergency?: string;
  };
}

export interface Position {
  previousPosition?: string;
  previousDepartment?: string;
  newPosition?: string;
  newDepartment?: string;
  salary?: number;
  benefits?: [string];
  employmentDate?: string;
  supervisorName?: string;
  duration?: string;
}
export interface Biography {
  DOB?: string;
  gender?: string;
  maritalStatus?: string;
  stateOfOrigin?: string;
  LGA?: string;
}

export interface CreateProduct {
  id: string;
  price: number;
  SKU: string;
  category: string;
  name: string;
  description: string;
  vendorID: string;
  unit: number;
  warehouse: string;
  quantity: string;
  row: number;
  level: number;
}

export interface createVendor {
  id: string;
  name: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface Form {
  date: string;
  vendorID: string;
  phoneNumber: string;
  email: string;
  productId: string;
  description: string;
  quantity: number;
  unit: number;
  unitPrice: number;
  deliveryDate: string;
}
export interface Escalate {
  name: string;
  department: string;
  supervisor: string;
  situation: string;
  annonymous: boolean;
}

export interface Tasks {
  name: string;
  manager: string;
  department: string;
  assignedBy: string;
  assignedDate: string;
  dependent: string;
  start: string;
  stop: string;
}

export interface Reistration {
  password: string;
  phoneNumber: string;
  firstname: string;
  lastname: string;
  email: string;
}
