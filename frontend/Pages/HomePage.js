import { homePageTemplate } from "../Templates/HomeTemplate.js";

export async function renderHomePage(container) {
    container.innerHTML = homePageTemplate();
}