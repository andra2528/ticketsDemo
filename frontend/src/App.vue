<template> 
  <link rel="stylesheet" href="/fontawesome/css/all.min.css">
  
  <router-view />

  <footer class="footer">
    <div class="content has-text-centered">
      <p> Support Tickets </p>
    </div>
  </footer>

</template>


<script>
  export default {
    name: "App",
  };
</script>

<style>
/* import style bulma */
@import "~bulma/css/bulma.css";

.title {
  color: rgb(204, 143, 241);
  margin-left: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.table td {
  font-size: 20px;
}
 
.table thead th {
  font-size: 25px;
  color: rgb(204, 143, 241);
}

.clickable:hover {
  text-decoration: underline;
  cursor: pointer;
}

div {
  margin-left: 10px;
  margin-right: 10px;
}

.second {
  margin-left:10px;
}

.button {
  margin-bottom:10px;
}
</style>
