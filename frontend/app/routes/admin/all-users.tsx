import { Header } from "components";
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Page,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "~/lib/utils";
import { useEffect } from "react";
import { useUser } from "~/context/UserContext";

const AllUsers = () => {
  const {
    users,
    fetchUsers,
    pageIndex,
    pageSize,
    setPageIndex,
    totalElements,
  } = useUser();

  useEffect(() => {
    fetchUsers(pageIndex, pageSize);
  }, [fetchUsers, pageIndex, pageSize]);

  const handlePageChange = (args: any) => {
    if (args.requestType === "paging") {
      setPageIndex(args.currentPage - 1);
    }
  };

  return (
    <main className="all-users wrapper">
      <Header
        title="Travel Community"
        description="Connect with fellow travelers and explore their activity"
      />

      <GridComponent
        dataSource={users}
        gridLines="None"
        allowPaging={true}
        pageSettings={{
          currentPage: pageIndex + 1,
          pageSize: pageSize,
          totalRecordsCount: totalElements,
        }}
        actionBegin={handlePageChange}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="username"
            headerText="Name"
            width="200"
            textAlign="Left"
            template={(props: CreatedUser) => (
              <div className="flex items-center gap-1.5">
                <img
                  src={props.imageUrl}
                  alt="user"
                  className="rounded-full size-8 aspect-square"
                  referrerPolicy="no-referrer"
                />
                <span>{props.fullName}</span>
              </div>
            )}
          />
          <ColumnDirective
            field="itineraryCreated"
            headerText="Trips Created"
            width="130"
            textAlign="Left"
          />
          <ColumnDirective
            field="ratedTripsCount"
            headerText="Trips Rated"
            width="130"
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width="140"
            textAlign="Left"
            template={({ joinedAt }: { joinedAt: string }) =>
              formatDate(joinedAt)
            }
          />
          <ColumnDirective
            field="status"
            headerText="Type"
            width="100"
            textAlign="Left"
            template={({ status }: CreatedUser) => (
              <article
                className={cn(
                  "status-column",
                  status === "USER" ? "bg-success-50" : "bg-light-300"
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "USER" ? "bg-success-500" : "bg-gray-500"
                  )}
                />
                <h3
                  className={cn(
                    "font-inter text-xs font-medium",
                    status === "USER" ? "text-success-700" : "text-gray-500"
                  )}
                >
                  {status}
                </h3>
              </article>
            )}
          />
        </ColumnsDirective>
        <Inject services={[Page]} />
      </GridComponent>
    </main>
  );
};

export default AllUsers;
