import { Client, Query, TablesDB, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
  .setEndpoint(`${APPWRITE_ENDPOINT}`)
  .setProject(`${PROJECT_ID}`);

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await tablesDB.listRows({
      databaseId: `${DATABASE_ID}`,
      tableId: `${TABLE_ID}`,
      queries: [Query.equal("searchTerm", searchTerm)],
    });
    console.log(result);

    // 2. If it does, update the count
    if (result.total > 0) {
      const doc = result.rows[0];

      await tablesDB.updateRow(`${DATABASE_ID}`, `${TABLE_ID}`, doc.$id, {
        count: doc.count + 1,
      });
      // 3. If it doesn't, create a new document with the search term and count as 1
    } else {
      await tablesDB.createRow({
        databaseId: `${DATABASE_ID}`,
        tableId: `${TABLE_ID}`,
        rowId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await tablesDB.listRows({
      databaseId: `${DATABASE_ID}`,
      tableId: `${TABLE_ID}`,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });
    
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};
