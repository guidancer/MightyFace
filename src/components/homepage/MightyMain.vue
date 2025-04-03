<script setup>
import MightySection from './MightySection.vue';
import MightyFooter from './MightyFooter.vue';
</script>
<template>
    <div class="lg:px-32 sm:px-16 py-16 mx-auto bg-gray-800">
        <div class="items-center lg:flex">
            <div class="w-full lg:w-2/12"></div>
            <div class="w-full lg:w-3/12">
                <div class="px-6">
                    <h1
                        class="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-3xl lg:text-5xl">
                        使用我们的系统
                        <br><span class="text-blue-600 ">防御深度伪造</span>
                    </h1>
                    <p class="mt-3 text-gray-300 dark:text-gray-400">人脸深度伪造带来日益严重的隐患.我们的原型系统<br>能够从主动与被动两个方面对深度伪造进行有效防御
                    </p>
                    <button
                        class="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">了解详情</button>
                </div>
            </div>
            <div class="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-5/12">
                <img class="w-full h-full lg:max-w-3xl rounded-md" src="../../assets/deepfake.png"
                    alt="Catalogue-pana.svg">
            </div>
            <div class="w-full lg:w-2/12"></div>
        </div>
    </div>
    <MightySection />
    <MightyFooter />
</template>
<style scoped></style>
