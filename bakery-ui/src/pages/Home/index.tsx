import { useSelector } from "react-redux";
import { selectUser } from "@/redux/user/selectors";
import Layout from "@/layouts/Layout";
import CustomerDashboard from "./CustomerDashboard";
import ShopOwnerDashboard from "./ShopOwnerDashboard";

const Home = () => {
  const { role } = useSelector(selectUser);

  return (
    <Layout>
      {role === "SHOP_OWNER" ? <ShopOwnerDashboard /> : <CustomerDashboard />}
    </Layout>
  );
};

export default Home;
