<script setup>
import MightyCardOne from './MightyCardOne.vue';
import MightyCardTwo from './MightyCardTwo.vue';
import MightySayFake from './MightySayFake.vue';
import MightyJoinUs from './MightyJoinUs.vue';
</script>
<template>
    <div class="lg:px-32 sm:px-16 py-16 mx-auto bg-gray-800">
        <div class="items-center lg:flex sm:flex">
            <div class="w-full lg:w-2/12"></div>
            <div class="w-full lg:w-8/12">
                <div class="flex">
                    <div class="w-full lg:w-1/2 mr-2 bg-slate-900 rounded-md">
                        <MightyCardOne />
                    </div>
                    <div class="w-full lg:w-1/2 ml-2 bg-slate-900 rounded-md">
                        <MightyCardTwo />
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-2/12"></div>
        </div>
    </div>
    <div class="lg:px-32 sm:px-16 py-16 bg-slate-800 mx-auto">
        <div class="items-center lg:flex sm:flex">
            <div class="w-full lg:w-2/12"></div>
            <div class="w-full lg:w-8/12 bg-purple-200 rounded-xl shadow-md shadow-slate-50">
                <MightySayFake />
            </div>
            <div class="w-full lg:w-2/12"></div>
        </div>
    </div>
    <MightyJoinUs />
</template>
<style scoped></style>