export const notionRenderValue = (object: Record<string, any>) => {
  switch (object.type) {
    case "date":
      return object.date?.start;
    case "email":
      return object.email;
    case "rich_text":
      return (object.rich_text || []).reduce(
        (str: string, item: any) => ((str += item.plain_text), str),
        ""
      );
    case "url":
      return object.url;
    case "multi_select":
      return (object.multi_select || []).reduce(
        (items: any[], item: any) => (
          items.push(
            <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
              {item.name}
            </span>
          ),
          items
        ),
        []
      );
    case "number":
      return object.number;
    case "status":
      return object.status?.name;
    case "title":
    default:
      return (object.title || []).reduce(
        (str: string, item: any) => ((str += item.plain_text), str),
        ""
      );
  }
};
