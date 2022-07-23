import { CategoryModel } from "../models";
import { DATAS } from "../datas";
import axios from "axios";

const getCategories = async () => await axios.get("news_categories");

export default {
  getCategories,
};
