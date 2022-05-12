import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { useRouter } from "next/router";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  // paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayout = (props) => {
  const router = useRouter();
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  console.log({ router });

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          className="zone-pages"
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      {["/facturas/[id]", "/account/[id]"].includes(router.route) && (
        <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      )}
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  );
};
