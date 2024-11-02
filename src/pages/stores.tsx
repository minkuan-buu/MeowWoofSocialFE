import { Banner } from "@/components/store/banner";
import { Category } from "@/components/store/category";
import { TopProductTrending } from "@/components/store/product";
import NonFooterLayout from "@/layouts/non-footer";

export default function Store() {
  return (
    <NonFooterLayout>
      <div className="flex justify-center pt-5 pb-20">
        <div className="flex flex-col gap-4 h-full">
          <Banner />
          <Category />
          <TopProductTrending />
        </div>
      </div>
    </NonFooterLayout>
  );
}
