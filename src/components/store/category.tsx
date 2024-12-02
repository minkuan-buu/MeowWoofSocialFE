import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Category } from "@/interface/category";
import { GETCATEGORIES } from "@/api/Category";

export function CategoryBar() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await GETCATEGORIES({
        token: localStorage.getItem("token") || "",
      });

      if (result.isSuccess && result.res != null) {
        var getData = result.res.data;

        getData.forEach((item) => {
          item.link = `/stores?category=${item.id}`;
        });
        setCategories(getData);
      }
    }
    fetchCategories();
  },[]);

  return (
    <Card className="">
      <CardHeader>
        <h1 className="text-2xl">Danh mục</h1>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <a href={category.link} className="flex flex-col items-center">
                <img
                  src={category.attachment}
                  width={70}
                  height={70}
                  alt={category.name}
                  className="rounded-full mb-2"
                />
                <div className="text-md">{category.name}</div>
              </a>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
