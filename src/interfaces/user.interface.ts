export interface IUser{
    name: string //String es un objeto string es tipo de dato, tipo de dato primitivo
    lastname: string
    email: string
    password?: string
    token?: string
    salt?: string  //signo ? lo hace opcional
}