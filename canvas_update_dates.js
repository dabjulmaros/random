(() => {
  const courseNum = window.location.href.match(/courses\/(\d+)\//)[1];
  if (courseNum == isNaN || !ENV.current_user_roles.includes("admin")) {
    console.log("No course number, or no permissions to run this command");
    return;
  }

  const update = true;
  fetch(
    `/api/v1/courses/${courseNum}/assignments?search_term=assignment%20&per_page=20`
  )
    .then((r) => r.json())
    .then((j) => {
      let currentDate = new Date();
      currentDate = currentDate.setDate(currentDate.getDate() + 6);
      const updatedDate = new Date(currentDate);
      updatedDate.setHours(0);
      updatedDate.setMinutes(0);
      updatedDate.setSeconds(0);
      updatedDate.setMilliseconds(0);
      console.log(updatedDate.toISOString());

      for (const x of j)
        if (update) {
          $.ajax({
            url: `/api/v1/courses/${courseNum}/assignments/${x.id
              }?assignment[due_at]=${updatedDate.toISOString()}`,
            type: "PUT",
            success: function (result) {
              console.log("Success:", result);
            },
          });
        } else {
          console.log(x.id);
        }
    });
})();

