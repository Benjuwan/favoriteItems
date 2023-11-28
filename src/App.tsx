import { Items } from "./components/Items";

export const App = () => {
  const globalWrapper: object = {
    "width": "clamp(240px, 100%, 960px)",
    "margin": "2.5em auto"
  }

  return (
    <div style={globalWrapper}>
      <Items />
    </div>
  );
}