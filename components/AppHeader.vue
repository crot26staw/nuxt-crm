<script lang="ts" setup>
const supabase = useSupabaseClient();
const router = useRouter();
import { useDataUserStore } from '~/store/dataUser';

const { resetStore } = useDataUserStore();
const logOut = async () => {
    resetStore();
    await supabase.auth.signOut();
    await router.push('/signup');
}

const { dataUser } = storeToRefs(useDataUserStore());

</script>
<template>
    <div class="AppHeader">
        <div class="AppHeader__arrow">
            <NuxtImg src="icons/arrow.svg" width="32px"/>
        </div>
        <div class="AppHeader__container">
            <div class="AppHeader__head">
                <NuxtLink to="/">
                    <NuxtImg v-if="dataUser.name == ''" src="icons/logo.svg" width="120px" />
                    <p class="AppHeader__link" v-else>{{ dataUser.name }}</p>
                </NuxtLink>
                <div class="AppHeader__logout" @click="logOut">
                    <p>Выход</p>
                    <NuxtImg src="icons/logout.svg" class="AppHeader__icon" width="32px" />
                </div>
            </div>
            <nav class="AppHeader__nav">
                <ul class="AppHeader__ul">
                    <li class="AppHeader__li">
                        <NuxtLink class="AppHeader__link" to="/">
                            <div class="AppHeader__icon">
                                <NuxtImg src="icons/home.svg" width="24px" />
                            </div>
                            Главная
                        </NuxtLink>
                    </li>
                    <li class="AppHeader__li">
                        <NuxtLink class="AppHeader__link" to="/projects">
                            <div class="AppHeader__icon">
                                <NuxtImg src="icons/projects.svg" width="24px" />
                            </div>
                            Проекты
                        </NuxtLink>
                    </li>
                    <li class="AppHeader__li">
                        <NuxtLink class="AppHeader__link" to="/account">
                            <div class="AppHeader__icon">
                                <NuxtImg src="icons/account.svg" width="24px" />
                            </div>
                            Аккаунт
                        </NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
<style lang="scss">
.AppHeader {
    width: 60px;
    padding: 60px 20px;
    height: 100%;
    position: relative;
    flex-shrink: 0;
    background: var(--primary);
    overflow: hidden;
    transition: all 0.3s;

    &__arrow{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        transition: all 0.3s;
        opacity: 1;
    }

    &:hover{
        width: 300px;
        
        .AppHeader__container{
            opacity: 1;
        }

        .AppHeader__arrow{
            opacity: 0;
        }
    }

    &__container{
        width: 260px;
        transition: all 0.3s;
        opacity: 0;
    }

    &__head {
        display: flex;
        // align-items: flex-end;
        justify-content: space-between;
    }

    &__logout {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        margin-bottom: -5px;

        p {
            font-size: 20px;
            color: white;
        }
    }

    &__nav {
        margin-top: 60px;
    }

    &__ul {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-left: 12px;
    }

    &__li {
        transition: all 0.3s;

        &:hover {
            opacity: 0.7;
        }
    }

    &__link {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    &__link {
        font-size: 24px;
        font-weight: 600;
        position: relative;
        width: fit-content;
        color: white;
    }

}
</style>