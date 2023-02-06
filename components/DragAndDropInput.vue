<script setup lang="ts">
</script>

<template>
  <form class="form--file">
    <label 
      class="form--file-label" for="file">
      Drop your file here
      <img class="form--file-icon" src="../assets/img/drag-and-drop.png" alt="drag and drop icon"/>
      or 
      <button 
        class="form--file-button">Upload your file
        <img class="form--file-icon" src="../assets/img/upload.png" alt="upload"/>
        </button>
        <input 
          class="form--file-input" 
          type="file" 
          id="file" 
          name="file"
      />
    </label>
  </form>
</template>

<style lang="css" scoped>
.form--file {
  border: 4px dashed grey;
  max-width: 500px;
  height: 350px;
  border-radius: 16px;
}

.form--file:hover {
  border: 4px dashed rgb(177, 177, 177);
}
.form--file-label {
  background-color: rgb(251, 249, 249);
  height: 100%;
  width: 100%;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 2rem;;
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(6, 89, 89);
}

.form--file-button {
  border: 1px solid black;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: rgb(6, 89, 89);
  color: rgb(251, 249, 249);
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  gap:0.5rem;
}

.form--file-button:hover  {
  background-color: rgb(8, 139, 139);
}
.form--file-icon {
  width:50px;
  height:50px;
}

.form--file-input {
  display: none;
}
</style>