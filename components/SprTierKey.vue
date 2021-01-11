<template>
  <div>
    <div class="text-start">
      SPR reports are classified according to the following categoies:
    </div>
    <div class="flex justify-center">
      <div class="flex-col w-1/2">
        <div class="bg-spr-model">Model</div>
        <div class="bg-spr-reinforce">Reinforce</div>
        <div class="bg-spr-watch">Watch</div>
        <div class="bg-spr-intervene">Intervene</div>
      </div>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.bg-spr-intervene {
  background-color: theme('colors.spr-intervene');
}

.bg-spr-watch {
  background-color: theme('colors.spr-watch');
}

.bg-spr-reinforce {
  background-color: theme('colors.spr-reinforce');
}

.bg-spr-model {
  background-color: theme('colors.spr-model');
}
</style>
