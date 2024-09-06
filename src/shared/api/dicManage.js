import axiosInstance from "./index.js";
const dicUrl = "/doc/dic";

//获取字典列表
export async function getDicList() {
    const res = await axiosInstance.get(`${dicUrl}/getDicList`);
    return res;
}