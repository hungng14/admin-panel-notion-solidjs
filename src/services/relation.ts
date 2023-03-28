import { API_BASE_URL } from "../constants";
import { getValue } from "./storage";

export const createRelation = async (data: {
  name: string;
  properties: Record<string, any>[];
}) => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: `${getValue("user")?.id}`,
      },
      body: JSON.stringify({
        query: `mutation createRelation($createRelationInput: CreateRelationInput!){
          createRelation(createRelationInput: $createRelationInput) {
            id
            properties
          }
        }`,
        variables: {
          createRelationInput: {
            pageId: `${getValue("user")?.id}`,
            ...data,
          },
        },
      }),
    }).then((res) => res.json());
    return result.data.createRelation;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.message);
  }
};

export const getDetailRelation = async (relationId: string) => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: `${getValue("user")?.id}`,
      },
      body: JSON.stringify({
        query: `{ getDetailRelation(relationId: "${relationId}") {
            id
            name
            object
            properties
            created_time
            last_edited_time
          }
        }`,
      }),
    }).then((res) => res.json());
    if(!result.data.getDetailRelation) {
      console.log('error', result);
      throw new Error('Something went wrong');
    }
    return result.data.getDetailRelation;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.message);
  }
};

export const getListRelationsOfUser = async () => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: `${getValue("user")?.id}`,
      },
      body: JSON.stringify({
        query: `{
          getListRelationsOfUser(userId: "${getValue("user")?.id}" ) {
            relations {
              id
              name
              color
            }
          }
        }`,
      }),
    }).then((res) => res.json());
    const relations = result.data.getListRelationsOfUser.relations.map(
      (item: Record<string, string>) => {
        const [name, relationId] = item.name.split(":");
        return {
          ...item,
          name,
          relationId,
        };
      }
    );
    return relations;
  } catch (error) {
    return [];
  }
};

export const getPropertiesConfigOfRelation = async (
  relationId: string,
  filter:
    | "listProperties"
    | "addProperties"
    | "editProperties" = "listProperties"
) => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: `${getValue("user")?.id}`,
      },
      body: JSON.stringify({
        query: `{
          getPropertiesConfigOfRelation(relationId: "${relationId}" ) {
            property_names
            property_details
            configuration {
                id
                properties
            }
          }
        }`,
      }),
    }).then((res) => res.json());
    const { property_names, configuration, property_details } =
      result.data.getPropertiesConfigOfRelation;
    let allConfigProperties =
      configuration?.properties?.configuration?.rich_text?.[0]?.plain_text;
    try {
      allConfigProperties = JSON.parse(allConfigProperties);
    } catch (error) {
      allConfigProperties = {};
    }
    const propertiesByAction = allConfigProperties[filter];
    const propertiesAdded = property_names.reduce(
      (propsCanAdd: any[], prop: string) => {
        if (!propertiesByAction?.[prop]?.hidden) {
          propsCanAdd.push({
            prop: prop,
            type: property_details[prop].type || "rich_text",
          });
        }
        return propsCanAdd;
      },
      []
    );

    return propertiesAdded;
  } catch (error) {
    return [];
  }
};

export const addRecordOfRelation = async (
  relationId: string,
  data: Record<string, any>
) => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: `${getValue("user")?.id}`,
      },
      body: JSON.stringify({
        query: `mutation addRecordToRelation($createRecordInput: CreateRecordInput!){
          addRecordToRelation(createRecordInput: $createRecordInput) {
            id
            properties
          }
        }`,
        variables: {
          createRecordInput: {
            relationId: relationId,
            properties: data,
          },
        },
      }),
    }).then((res) => res.json());
    console.log("resu;t", result);
    return result.data.addRecordToRelation;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.message);
  }
};

export const getRecordOfRelation = async (recordId: string) => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: `${getValue("user")?.id}`,
      },
      body: JSON.stringify({
        query: `{
          getInfoRecordOfRelation(recordId: "${recordId}" ) {
            id
            object
            properties
            created_time
            last_edited_time
          }
        }`,
      }),
    }).then((res) => res.json());
    console.log("resu;t", result);
    return result.data.getInfoRecordOfRelation;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.message);
  }
};

export const updateRecordOfRelation = async (
  recordId: string,
  data: Record<string, any>
) => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: `${getValue("user")?.id}`,
      },
      body: JSON.stringify({
        query: `mutation updateRecordToRelation($updateRecordInput: UpdateRecordInput!){
          updateRecordToRelation(updateRecordInput: $updateRecordInput) {
            id
            properties
          }
        }`,
        variables: {
          updateRecordInput: {
            recordId: recordId,
            properties: data,
          },
        },
      }),
    }).then((res) => res.json());
    console.log("resu;t", result);
    return result.data.updateRecordToRelation;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.message);
  }
};

export const deleteRecordOfRelation = async (recordId: string) => {
  try {
    const result = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: `${getValue("user")?.id}`,
      },
      body: JSON.stringify({
        query: `mutation {
          deleteRecordToRelation(recordId: "${recordId}") {
            id
            properties
          }
        }`,
      }),
    }).then((res) => res.json());
    console.log("resu;t", result);
    return result.data.deleteRecordToRelation;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.message);
  }
};
