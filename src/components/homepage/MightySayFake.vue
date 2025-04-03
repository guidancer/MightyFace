<template>
  <section>
    <div class="px-6 py-8 sm:px-6 sm:py-12 lg:px-6 lg:py-8">
      <div class="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:items-center lg:gap-x-16">
        <div class="mx-auto max-w-lg lg:mx-0 ltr:lg:text-left rtl:lg:text-right">
          <h2 class="text-3xl font-bold sm:text-4xl text-start">人脸深度伪造</h2>

          <p class="mt-4 text-gray-600 text-start">
            我们也引入了一些常用的人脸深度伪造方法以供验证系统内置的防御方法的有效性.确保在合法且不侵权的情况下使用本系统内置的深度伪造方法.
          </p>

          <button
            class="w-full items-start px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-orange-600 rounded-lg lg:w-auto hover:bg-orange-500 focus:outline-none focus:bg-orange-500">相关隐私政策<img
              class="inline size-3" src="../../assets/right.png" /></button>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <span class="inline-block rounded-lg bg-gray-50 p-0">
            <img src="../../assets/attgan.png" class="size-fit" />
          </span>
          <span class="inline-block rounded-lg bg-gray-50 p-0">
            <img src="../../assets/stargan.png" class="h-full size-fit" />
          </span>
          <span class="inline-block rounded-lg bg-gray-50 p-0">
            <img src="../../assets/facehome.png" class="size-fit" />
          </span>
          <span class="inline-block rounded-lg bg-gray-50 p-0">
            <img src="../../assets/horai.png" class="h-full size-fit" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>