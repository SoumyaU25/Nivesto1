import React, { Suspense } from "react";
import ReportDetails from "./page";
import { BarLoader } from "react-spinners";

const ReportlayoutID = ({children}) => {
  return (
    <div className="px-5">
      {/* <h1 className='text-6xl font-bold gradient-title mb-5'>Dashboard</h1> */}

      {/*dashboard Page*/}
      <Suspense
        fallback={
          <BarLoader className="mt-4" width={"100%"} color="#1bb520ff" />
        }
      >
        {children}
      </Suspense>
      
    </div>
  );
};

export default ReportlayoutID;