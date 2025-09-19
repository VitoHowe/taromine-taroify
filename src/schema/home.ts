import { useQuery } from "urql"
import { graphql } from "~/gql"

export const fetchTabs = graphql(`
  query FetchTabs {
    litemallCategory(
      orderBy: { sortOrder: { direction: asc, priority: 10 } }
      where: { level: { eq: "L1" } }
      limit: 8
    ) {
      id
      name
      iconUrl
    }
  }
`)

export function fetchTabList() {
  const [{data}] = useQuery({ query: fetchTabs })
  return data?.litemallCategory
}

  // const tabsData = await urqlClient.query<FetchTabsQuery>(fetchTabs, {}).toPromise()
  // return tabsData.data?.litemallCategory
// }

export const fetchNewGoods = graphql(`
  query FetchNewGoods($limit: Int!, $offset: Int!) {
    litemallGoods(
      orderBy: { sortOrder: { direction: asc, priority: 10 } }
      where: { isOnSale: { eq: true }, isNew: { eq: true } }
      limit: $limit
      offset: $offset
    ) {
      id
      goodsSn
      name
      categoryId
      gallery
      keywords
      brief
      picUrl
      shareUrl
      isNew
      isHot
      unit
      counterPrice
      retailPrice
      detail
    }
  }
`)

export async function fetchNewGoodsList(limit: number, offset: number) {
  const [{data}] = useQuery({
    query: fetchNewGoods, variables: { limit, offset }
  })
  return data?.litemallGoods
}
