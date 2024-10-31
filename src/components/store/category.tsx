import { Card, CardBody, CardHeader } from "@nextui-org/react";

const categories = [
  {
    name: "Thức ăn cho chó",
    link: "/stores/food",
    imageSrc: "/food.png",
  },
  {
    name: "Thực phẩm",
    link: "/stores/food",
    imageSrc: "/food.png",
  },
];

export function Category() {
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
                  src={category.imageSrc}
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
