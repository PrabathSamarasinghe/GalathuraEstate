import LargerHighlightLineNoSnap from "../components/LineChart";
const Inventory = () => {
  return (
    <div>
      <h1 className="text-red-500 text-4xl font-bold">Inventory</h1>
      <p className="mt-4">
        Keep track of your stock levels and manage inventory efficiently!
      </p>
      <div className="mt-8">
        <LargerHighlightLineNoSnap />
      </div>
    </div>
  );
};

export default Inventory;
