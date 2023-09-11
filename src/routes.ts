import { Router,Request, Response} from 'express'
import UserController from './controllers/user.controller'

const authRoutes = Router()
const userCtrl = new UserController()

authRoutes.get('/getUsers', async( req: Request, res: Response ) => {
    try {
        const response = await userCtrl.getUsers()
        return res.status( response.code ).json( response )
    } catch( err:any ) {
        return res.status( err.code ? err.code : 500 ).json( err )
    }
})

authRoutes.post('/createUser', async(req: Request, res: Response) => {
    const { user } = req.body

    try {
        const response = await userCtrl.createUser(user)
        return res.status( response.code ).json( response )
    } catch(err:any) {
        return res.status( err.code ? err.code : 500 ).json( err )
    }
})

authRoutes.put('/update', async (req: Request, res: Response) => {
    const user: any = req.body.user
    console.log(user)
    //const updatedUser = req.body.user

    try {
        const response = await userCtrl.updateUser(user);
        return res.status(response.code).json(response)
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})

authRoutes.delete('/delete/:_id', async( req: Request, res: Response ) => {
   const _id: any = req.query._id
   try{
    const response = await userCtrl.deleteUser(_id)
    return res.status(response.code).json(response)
   }catch(err: any){
    return res.status( err.code ? err.code : 500 ).json( err )
   }
})

authRoutes.get('/getUserByEmail/:email', async(req: Request, res: Response) => {
    const email = req.params.email
    try{
        const response = await userCtrl.getUserByEmail(email)
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code: 500).json(err)

    }
})

authRoutes.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body
    console.log(email, password)
    try{
        const response = await userCtrl.loginUser(email, password)
        return res.status(response.code).json(response)
    }catch (err:any){
        return res.status(err.code ? err.code: 500).json(err)
    }
})

authRoutes.get('/ping', async(req: Request, res: Response) => {
    return res.status(200).json({"message":"pong"})
})


export default authRoutes