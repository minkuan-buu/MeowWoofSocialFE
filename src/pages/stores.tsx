import { GETFILTERCATEGORIES, GETFILTERSUBCATEGORIES } from "@/api/Category";
import Logout from "@/components/logout";
import { Banner } from "@/components/store/banner";
import { CategoryBar } from "@/components/store/category";
import { TopProductTrending } from "@/components/store/product";
import { FilterBar } from "@/components/store/product/filterBar";
import { ProductFilter } from "@/components/store/product/productFilter";
import { CategoryFilter } from "@/interface/category";
import NonFooterLayout from "@/layouts/non-footer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Store() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Track category, subcategory, and keyword in state
  const [categoryId, setCategoryId] = useState<string | null>(queryParams.get("category"));
  const [keyword, setKeyword] = useState<string | null>(queryParams.get("keyword"));
  const [subCategory, setSubCategory] = useState<string | null>(queryParams.get("sub"));
  const [filterCategories, setFilterCategories] = useState<CategoryFilter[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(categoryId);
  const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(subCategory);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    const result = await GETFILTERCATEGORIES({
      token: localStorage.getItem("token") || "",
    });

    if (result.isSuccess && result.res != null) {
      setFilterCategories(result.res.data);
    } else {
      if (result.statusCode === 401) {
        Logout();
      }
    }
    setIsLoading(false);
  };

  const fetchSubCategories = async () => {
    setIsLoading(true);
    const result = await GETFILTERSUBCATEGORIES({
      categoryId: currentCategory || "",
      token: localStorage.getItem("token") || "",
    });

    if (result.isSuccess && result.res != null) {
      setFilterCategories(result.res.data);
    } else {
      if (result.statusCode === 401) {
        Logout();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Update state when the URL query changes
    const categoryFromUrl = queryParams.get("category");
    const subCategoryFromUrl = queryParams.get("sub");
    const keywordFromUrl = queryParams.get("keyword");

    setCategoryId(categoryFromUrl);
    setSubCategory(subCategoryFromUrl);
    setKeyword(keywordFromUrl);

    setCurrentCategory(categoryFromUrl);
    setCurrentSubCategory(subCategoryFromUrl);
  }, [location.search]); // Runs when the query parameters change

  useEffect(() => {
    console.log("Fetching categories or subcategories...");
    if (keyword != null && currentCategory == null && currentSubCategory == null) {
      fetchCategories();
    } else if (currentCategory != null) {
      fetchSubCategories();
    }
  }, [currentCategory, currentSubCategory, keyword]); // Runs when any of these values change

  return (
    <NonFooterLayout>
      <div className="flex justify-center pt-5 pb-20">
        {categoryId == null && keyword == null ? (
          <div className="flex flex-col gap-4 h-full">
            <Banner />
            <CategoryBar />
            <TopProductTrending />
          </div>
        ) : (
          <div className="relative grid grid-cols-10">
            <div className="flex justify-center items-start col-span-3">
              <FilterBar
                categories={filterCategories}
                setCurrentCategory={setCurrentCategory}
                setCurrentSubCategory={setCurrentSubCategory}
                currentCategory={currentCategory}
                currentSubCategory={currentSubCategory}
                setIsLoading={setIsLoading}
              />
            </div>
            <div className="flex justify-center items-start col-span-7">
              <ProductFilter
                currentCategory={currentCategory}
                currentSubCategory={currentSubCategory}
                keyWord={keyword}
              />
            </div>
          </div>
        )}
      </div>
    </NonFooterLayout>
  );
}
