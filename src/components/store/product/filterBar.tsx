import { CategoryFilter } from "@/interface/category";
import { Checkbox, Radio, RadioGroup } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FilterBarProps {
  categories: CategoryFilter[];
  currentCategory: string | null;
  setCurrentCategory: React.Dispatch<React.SetStateAction<string | null>>;
  currentSubCategory: string | null;
  setCurrentSubCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  currentCategory,
  setCurrentCategory,
  currentSubCategory,
  setCurrentSubCategory,
  setIsLoading,
}) => {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const handleSubCategoryChange = (id: string) => {
    setIsLoading(true);
    setCurrentSubCategory(id);

    // Update URL with the subCategory parameter
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("sub", id);

    const parentCategory = categories.find((cat) =>
      cat.subCategories.some((sub) => sub.id === id)
    );

    if (parentCategory) {
      setCurrentCategory(parentCategory.id);
      queryParams.set("category", parentCategory.id);
      setCheckedState((prevState) => ({
        ...prevState,
        [parentCategory.id]: true,
      }));
    }

    navigate(`${window.location.pathname}?${queryParams.toString()}`);
  };

  const handleCategoryChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);

    const isChecked = event.target.checked;
    setCheckedState((prevState) => ({
      ...prevState,
      [id]: isChecked,
    }));

    if (!isChecked) {
      // Clear subcategories if category is unchecked
      const subCategoryIds = categories
        .find((cat) => cat.id === id)
        ?.subCategories.map((sub) => sub.id);

      if (subCategoryIds) {
        subCategoryIds.forEach((subId) => {
          setCheckedState((prevState) => ({
            ...prevState,
            [subId]: false,
          }));
        });
      }

      // Remove category and subCategory from URL
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.delete("category");
      queryParams.delete("sub");
      navigate(`${window.location.pathname}?${queryParams.toString()}`);

      setCurrentCategory(null);
      setCurrentSubCategory(null);
    } else {
      // Update URL with category parameter
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set("category", id);
      navigate(`${window.location.pathname}?${queryParams.toString()}`);
      setCurrentCategory(id);
    }
  };

  const renderCategories = (categories: CategoryFilter[]) => {
    return categories.map((category) => (
      <div key={category.id} className="flex flex-col items-start mb-4">
        <Checkbox
          isSelected={checkedState[category.id] || false}
          onChange={(event) => handleCategoryChange(category.id, event)}
        >
          <span className="text-[#102530]">{category.name}</span>
        </Checkbox>
        {category.subCategories.length > 0 && (
          <div className="pl-4">
            <RadioGroup
              value={currentSubCategory || ""}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
            >
              {category.subCategories.map((subCategory) => (
                <Radio
                  key={subCategory.id}
                  value={subCategory.id}
                  color="primary"
                >
                  <span className="text-[#102530]">{subCategory.name}</span>
                </Radio>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-2 text-[#102530]">
      <span className="text-2xl font-bold">Bộ lọc</span>
      {renderCategories(categories)}
    </div>
  );
};
