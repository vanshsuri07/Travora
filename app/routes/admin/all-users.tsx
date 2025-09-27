import  Header  from "../../../components/Header"
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";
import CustomUsersTable from "components/ui/CustomUserstable";

export const loader = async () => {
  const { users, total } = await getAllUsers( 10, 0);
  return { users, total };
}

const AllUsers = ({loaderData}: Route.ComponentProps) => {
const { users } = loaderData;
  return (
    <main className='all-users wrapper'>
            <Header
               title="Manage Users"
               description =" Filter, sort, and manage users in the system. You can view user details, edit their information, and delete users as needed."
            />
        <CustomUsersTable users={users} />
    </main>
  )
}

export default AllUsers
