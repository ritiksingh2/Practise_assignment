
  
  // Async/Await version
  const getButter = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Husband: I got the butter!");
        resolve("butter");
      }, 2000);
    });
  };
  
  const getColdDrinks = (butter) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`Wife: I got the cold drinks using ${butter}`);
        resolve("cold drinks");
      }, 1000);
    });
  };
  

  
  
  // Promise.all with Async/Await
  const getJam = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Wife: I got the jam!");
        resolve("jam");
      }, 500);
    });
  };
  
  const makeToast = async () => {
    try {
      const [butter, jam] = await Promise.all([getButter(), getJam()]);
      const drinks = await getColdDrinks(butter);
      console.log("Both: Let's enjoy the toast with", butter, jam, "and", drinks);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  makeToast();
  
  
  // Async/Await version of createPost and deletePost
  const createPost = async (post) => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(post),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      console.log("Post created:", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  const deletePost = async (id) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("Post deleted:", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  createPost({
    title: "My new post",
    body: "This is my new post.",
    userId: 1,
  });
  
  deletePost(1);
  