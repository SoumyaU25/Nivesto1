import React, { Suspense } from "react";
import Dashboard from "./page";
import { BarLoader } from "react-spinners";

const Dashboardlayout = () => {
  return (
    <div className="px-5">
      {/* <h1 className='text-6xl font-bold gradient-title mb-5'>Dashboard</h1> */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold gradient-title mb-5">
        Dashboard
      </h1>

      {/*dashboard Page*/}
      <Suspense
        fallback={
          <BarLoader className="mt-4" width={"100%"} color="#1bb520ff" />
        }
      >
        <Dashboard />
      </Suspense>
    </div>
  );
};

export default Dashboardlayout;
