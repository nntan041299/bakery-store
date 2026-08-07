import { useSelector } from "react-redux";
import { selectUser } from "@/redux/user/selectors";
import Layout from "@/layouts/Layout";

const Home = () => {
  const { username, email, firstName, lastName } = useSelector(selectUser);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

  return (
    <Layout>
      <div className="min-h-full flex flex-col items-center justify-center gap-2 px-6 py-16">
        <h1
          className="text-2xl font-bold text-surface-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome{fullName ? `, ${fullName}` : ""}
        </h1>
        {email && <p className="text-sm text-surface-500">{email}</p>}
      </div>
    </Layout>
  );
};

export default Home;
