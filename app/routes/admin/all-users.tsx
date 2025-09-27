import  Header  from "../../../components/Header"
import {  ColumnDirective, ColumnsDirective ,GridComponent } from "@syncfusion/ej2-react-grids";
import { cn } from "~/lib/utlis";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";

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
         <GridComponent dataSource={users} gridLines="None">
          <ColumnsDirective>
                <ColumnDirective
                field="name"
                headerText="Name" 
                width="200"
                textAlign="Left"
                template={(props: UserData)=>(
                  <div className="flex items-center gap-1.5 px-4">
                    <img src={props.imageUrl} alt="user" className="rounded-full size-8 aspect-square" referrerPolicy="no-referrer"/>
                    <span>{props.name}</span>
                  </div>
                )

                }
                />

               <ColumnDirective
                field="email"
                headerText="Email Address" 
                width="200"
                textAlign="Left"
                />
                <ColumnDirective
                field="joinedAt"
                headerText="Date Joined" 
                width="120"
                textAlign="Left"
                />
               
                 <ColumnDirective
                        field="status"
                        headerText="Type"
                        width="100"
                        textAlign="Left"
                        template={({ status }: UserData) => (
                            <article className={cn('status-column', status === 'user' ? 'bg-success-50': 'bg-light-300')}>
                                <div className={cn('size-1.5 rounded-full', status === 'user' ? 'bg-success-500': 'bg-gray-500')} />
                                    <h3 className={cn('font-inter text-xs font-medium', status === 'user' ? 'text-success-700' : 'text-gray-500')}>
                                        {status}
                                    </h3>
                            </article>
                        )}
                    />
                    </ColumnsDirective>
         </GridComponent>
    </main>
  )
}

export default AllUsers
